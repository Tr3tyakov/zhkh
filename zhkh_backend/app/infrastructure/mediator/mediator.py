from typing import (
    Any,
    List,
    Optional,
)

from app.application.common.interfaces.behavior import IPipelineBehavior
from app.application.common.interfaces.container import IServiceProvider
from app.application.common.interfaces.mediator import IMediator
from app.application.common.interfaces.request import (
    INotification,
    INotificationHandler,
    IRequest,
    IRequestHandler,
    TNotification,
    TRequest,
)
from app.infrastructure.containers.utils import transform_to_snake_case
from app.infrastructure.mediator.pipline_context import PipelineContext


class MediatorError(Exception): ...


class Mediator(IMediator):
    def __init__(
        self, service_provider: IServiceProvider, behaviors: List[IPipelineBehavior]
    ):
        self._service_provider = service_provider
        self._behaviors = behaviors

    async def send(self, request: IRequest) -> Any:
        provider_name: str = transform_to_snake_case(request.__class__.__name__)
        handler: Optional[IRequestHandler[TRequest, Any]] = (
            self._service_provider.resolve(provider_name)
        )

        # Применяем все pipeline behaviors
        context = PipelineContext()
        for behavior in self._behaviors:
            await behavior.handle(request, context)

        if handler is None:
            return

        return await handler.handle(request, context)

    async def publish(self, notification: TNotification) -> Any:
        provider_name: str = transform_to_snake_case(notification.__class__.__name__)
        handler: Optional[INotificationHandler[INotification]] = (
            self._service_provider.resolve(provider_name)
        )

        if handler is None:
            return

        return await handler.handle(notification)
