# UC-2 Sign Up Backend Audit

Date: 2026-04-06

Scope reviewed:
- Auth registration endpoint, request validation, and response payload.
- Error handling and security controls around account creation.

Key findings:
- Endpoint `POST /api/auth/register` exists and is publicly accessible.
- Registration requires `email`, `password`, and `verifiedPassword`; `fullName` is optional and auto-derived from email local part.
- Duplicate email is checked in service (`existsByEmail`) and also enforced by DB unique constraint.
- Password is hashed via Spring `PasswordEncoder` before persistence.
- Successful register response returns token + user fields and does not expose password.
- Error status codes for validation/duplicate account creation currently return 400; no dedicated 409 for duplicate email.
- There is a race window between `existsByEmail` and `save`; DB unique constraint still prevents duplicates.
- Registration flow is not wrapped in transaction annotation.
