# orders/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from .models import Order


@shared_task
def send_order_confirmation_email(order_id):
    try:
        order = Order.objects.prefetch_related("items__product").get(id=order_id)

        # Build order items string
        items_details = ""
        for item in order.items.all():
            subtotal = item.quantity * item.price  # price is already stored per item
            items_details += f"- {item.product.name}: {item.quantity} × ₹{item.price} = ₹{subtotal}\n"

        # Full email message
        message = (
            f"Hi {order.user.username},\n\n"
            f"Your order has been confirmed!\n\n"
            f"Order ID: {order.id}\n\n"
            f"Items:\n{items_details}\n"
            f"Total: ₹{order.total}\n\n"
            f"Thank you for shopping with us!"
        )

        send_mail(
            subject=f"Order Confirmation #{order.id}",
            message=message,
            from_email=None,  # Uses DEFAULT_FROM_EMAIL from settings.py
            recipient_list=[order.user.email],
        )
        return f"Email sent to {order.user.email}"

    except Order.DoesNotExist:
        return f"Order {order_id} does not exist"
