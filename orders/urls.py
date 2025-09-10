from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from .views import AdminOrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')  # works for both users & admins
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = router.urls
