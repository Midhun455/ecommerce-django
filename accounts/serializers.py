# accounts/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # Works whether is_admin is on the user model or on a related profile
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_admin", "date_joined")

    def get_is_admin(self, obj):
        # 1) If your CustomUser has an is_admin field
        if hasattr(obj, "is_admin"):
            return bool(getattr(obj, "is_admin"))

        # 2) If you used a separate profile model (UserProfile with is_admin)
        profile = getattr(obj, "userprofile", None)  # common name used earlier
        if profile is not None:
            return bool(getattr(profile, "is_admin", False))

        # 3) Fallback to Django staff/superuser
        return bool(getattr(obj, "is_staff", False) or getattr(obj, "is_superuser", False))
