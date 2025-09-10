from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import CartItemSerializer
from products.models import Product
from .models import CartItem


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return cart items for the logged-in user
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get("product")
        quantity = int(self.request.data.get("quantity", 1))
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError({"product": "Invalid product ID."})
        # ✅ Stock check
        if quantity > product.stock:
            raise ValidationError(
                {"quantity": f"Only {product.stock} items available in stock."}
            )
        existing_item = CartItem.objects.filter(
            user=self.request.user, product=product
        ).first()
        if existing_item:
            new_quantity = existing_item.quantity + quantity
            if new_quantity > product.stock:
                raise ValidationError(
                    {"quantity": f"Maximum stock available is {product.stock}."}
                )
            existing_item.quantity = new_quantity
            existing_item.save()
        else:
            serializer.save(user=self.request.user, product=product)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        quantity = request.data.get("quantity", instance.quantity)

        # ✅ Ensure stock limit
        if int(quantity) > instance.product.stock:
            raise ValidationError(
                {"quantity": f"Only {instance.product.stock} items available."}
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Remove an item from the cart"""
        instance = self.get_object()
        instance.delete()
        return Response(
            {"detail": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    user = request.user
    user.cart_items.all().delete()  # Assuming you have related_name="cart_items"
    return Response({"message": "Cart cleared successfully"})
