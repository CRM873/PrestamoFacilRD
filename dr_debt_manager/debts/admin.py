from django.contrib import admin
from .models import Debt, Payment


class PaymentInline(admin.TabularInline):
	model = Payment
	extra = 0


@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
	list_display = ("title", "customer", "principal", "annual_interest_rate", "term_in_periods", "frequency", "created_at")
	list_filter = ("frequency", "created_at")
	search_fields = ("title", "customer__first_name", "customer__last_name")
	inlines = [PaymentInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
	list_display = ("debt", "date", "amount", "method")
	list_filter = ("method", "date")
	search_fields = ("debt__title", "debt__customer__first_name", "debt__customer__last_name")
