from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Order, OrderItem
from .serializers import OrderSerializer
import stripe
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .tasks import send_order_confirmation_email

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Admin can see all orders
            return Order.objects.all().order_by("-created_at")
        # Normal users see only their own orders
        return Order.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        send_order_confirmation_email.delay(order.id)

    def perform_update(self, serializer):
        order = self.get_object()
        if self.request.user == order.user or self.request.user.is_staff:
            serializer.save()
        else:
            raise PermissionDenied("Not allowed to update this order")

    def perform_destroy(self, instance):
        if self.request.user == instance.user or self.request.user.is_staff:
            instance.delete()
        else:
            raise PermissionDenied("Not allowed to delete this order")

import os
SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = SECRET_KEY  # your secret key

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    amount = request.data.get("amount", 0)
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency="inr",
        payment_method_types=["card"],
    )
    return Response({"clientSecret": intent.client_secret})

    
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # 👈 important
        return super().update(request, *args, **kwargs)
