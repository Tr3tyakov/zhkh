from app.presentation.api.routers.audit_logs.logs import audit_log_router
from app.presentation.api.routers.auth.authorization import authorization_router
from app.presentation.api.routers.auth.registration import registration_router
from app.presentation.api.routers.companies.company import company_router
from app.presentation.api.routers.generate_documents.documents import (
    generate_document_router,
)
from app.presentation.api.routers.houses.house import house_router
from app.presentation.api.routers.reference_book.reference import reference_book_router
from app.presentation.api.routers.reference_book_values.reference import (
    reference_book_value_router,
)
from app.presentation.api.routers.users.user import user_router

ROUTERS = [
    authorization_router,
    user_router,
    registration_router,
    house_router,
    company_router,
    generate_document_router,
    audit_log_router,
    reference_book_value_router,
    reference_book_router,
]
