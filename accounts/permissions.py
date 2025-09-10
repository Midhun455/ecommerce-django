from rest_framework.permissions import BasePermission

class IsAppAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "userprofile") and request.user.userprofile.is_admin
