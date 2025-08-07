from app.application.common.interfaces.container import IContainer


# SERVICES
def add_services(_, di_container: IContainer) -> IContainer:
    return di_container
