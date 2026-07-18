# ADR-006: Stripe Webhooks Are Billing Authority

Status: Accepted

Client redirects and success pages never grant paid access. Product-core verifies Stripe's raw webhook signature, records/deduplicates events, and projects subscription/payment/entitlement state. A scheduled reconciliation repairs missed or delayed webhook processing.
