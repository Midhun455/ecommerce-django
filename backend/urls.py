"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from cart.views import CartItemViewSet
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from orders.views import create_payment_intent
from accounts.views import MeView, AdminUserViewSet
from users.views import admin_stats

router = DefaultRouter()
router.register(r"cart", CartItemViewSet)
router.register("admin/users", AdminUserViewSet, basename="admin-users")
urlpatterns = [
    path("admin/", admin.site.urls),
    # API routes
    path("api/", include("products.urls")),
    path("api/", include("cart.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("accounts.urls")),
    path("api/", include(router.urls)),  # 👈 Add this line
    # For browsable API login/logout
    path("api/auth/", include("rest_framework.urls")),
    # ✅ JWT endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/create-payment-intent/", create_payment_intent),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/admin/stats/", admin_stats, name="admin-stats"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
