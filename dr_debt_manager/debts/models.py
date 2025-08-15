from __future__ import annotations
from decimal import Decimal, ROUND_HALF_UP
from django.db import models
from django.utils import timezone


class Debt(models.Model):
	FREQUENCY_MONTHLY = "monthly"
	FREQUENCY_WEEKLY = "weekly"
	FREQUENCY_CHOICES = [
		(FREQUENCY_MONTHLY, "Monthly"),
		(FREQUENCY_WEEKLY, "Weekly"),
	]

	customer = models.ForeignKey("customers.Customer", on_delete=models.CASCADE, related_name="debts")
	title = models.CharField(max_length=200)
	principal = models.DecimalField(max_digits=12, decimal_places=2)
	annual_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percent per year, e.g., 24.00")
	start_date = models.DateField(default=timezone.now)
	term_in_periods = models.PositiveIntegerField(help_text="Number of payments")
	frequency = models.CharField(max_length=16, choices=FREQUENCY_CHOICES, default=FREQUENCY_MONTHLY)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return f"{self.title} - {self.customer}"

	@property
	def periodic_interest_rate(self) -> Decimal:
		apr = Decimal(self.annual_interest_rate) / Decimal("100")
		if self.frequency == self.FREQUENCY_MONTHLY:
			return (apr / Decimal("12")).quantize(Decimal("0.00000001"))
		return (apr / Decimal("52")).quantize(Decimal("0.00000001"))

	def compute_payment_amount(self) -> Decimal:
		r = self.periodic_interest_rate
		n = Decimal(self.term_in_periods)
		P = Decimal(self.principal)
		if r == 0:
			return (P / n).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
		# annuity payment formula
		payment = P * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
		return Decimal(payment).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def generate_schedule(self) -> list[dict]:
		balance = Decimal(self.principal)
		r = self.periodic_interest_rate
		payment_amount = self.compute_payment_amount()
		schedule: list[dict] = []
		for period in range(1, int(self.term_in_periods) + 1):
			interest = (balance * r).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
			principal_component = (payment_amount - interest).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
			if principal_component > balance:
				principal_component = balance
			payment = principal_component + interest
			balance = (balance - principal_component).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
			schedule.append({
				"period": period,
				"payment": payment,
				"principal": principal_component,
				"interest": interest,
				"balance": balance,
			})
		return schedule


class Payment(models.Model):
	debt = models.ForeignKey(Debt, on_delete=models.CASCADE, related_name="payments")
	date = models.DateField(default=timezone.now)
	amount = models.DecimalField(max_digits=12, decimal_places=2)
	method = models.CharField(max_length=50, blank=True)
	notes = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-date", "-created_at"]

	def __str__(self) -> str:
		return f"{self.debt} payment {self.amount} on {self.date}"
