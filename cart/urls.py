from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CartItemViewSet, clear_cart

router = DefaultRouter()
router.register(r'cart', CartItemViewSet, basename="cart")

urlpatterns = [
    path('cart/clear/', clear_cart, name='clear_cart'),  # ✅ custom path
]

urlpatterns += router.urls  # ✅ include router-generated URLs
