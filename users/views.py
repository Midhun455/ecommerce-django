from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Sum
from products.models import Product
from orders.models import Order
from django.contrib.auth.models import User

# Create your views here.
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_stats(request):
    products_count = Product.objects.count()
    orders_count = Order.objects.count()
    users_count = User.objects.filter(is_staff=False).count()
    revenue = Order.objects.filter(status="completed").aggregate(total=Sum("total"))["total"] or 0

    return Response({
        "products": products_count,
        "orders": orders_count,
        "users": users_count,
        "revenue": revenue,
    })