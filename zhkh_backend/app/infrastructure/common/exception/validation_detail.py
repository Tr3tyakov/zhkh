from app.infrastructure.common.enums.base import BaseEnum


class ValidationReasonType(BaseEnum):
    """Сообщения ошибок валидации"""

    # Даты
    DATES_REQUIRED = "Начальная и конечная даты должны быть заданы"
    DATE_ALREADY_EXIST = "Дата уже существует"
    DATE_TOO_EARLY_LIMIT = "Дата должна быть позднее предельной"
    DATE_TOO_LATE = "Дата не может быть позднее текущей"
    DATE_TOO_LATE_LIMIT = "Дата должна быть раньше предельной"
    START_DATE_AFTER_END_DATE = (
        "Начальная дата должна быть меньше или равна конечной дате"
    )
    DATE_LATE_THAN_TODAY = "Дата должна быть больше текущей"

    # Поля
    SAVE_ERROR = "Ошибка сохранения данных"
    OTHER_SERVICE_ERROR = "Ошибка при взаимодействии со сторонним сервисом"
    ALPHABETIC_CHARACTERS_ONLY = "Поле должно содержать только символы алфавита"
    NON_CYRILLIC_CHARACTERS_RESTRICTION = "Поле не должно содержать русских букв"
    FIELD_BLOCK_MODIFICATION = "Некорректное значение поля для операции редактирования"
    MAX_LENGTH_EXCEEDED = "Превышена максимальная длина поля"
    MAX_VALUE_EXCEEDED = "Превышено максимальное значение поля"
    MIN_VALUE_EXCEEDED = "Значение поля меньше допустимого"
    MODIFICATION_UNAVAILABLE = "Редактирование поля запрещено"
    REQUESTED_TRANSITION_UNAVAILABLE = "Запрашиваемый переход статуса недоступен"

    # Значения
    ADD_UNAVAILABLE = "Добавление запрещено"
    EDIT_UNAVAILABLE = "Редактирование запрещено"
    AT_LEAST_ONE_VALUE = "Хотя бы одно из значений должно быть введено"
    DATE_RESTRICTION = "Значение поля должно являться датой"
    DELETE_NOT_ALLOWED = "Удаление запрещено"
    ENTITY_ALREADY_EXISTS = "Сущность уже существует в системе"
    ENTITY_IS_EQUAL = "Все поля сущности совпадают"
    ENTITY_NOT_FOUND = "Сущность отсутствует в системе"
    LOGIN_OR_PASSWORD_IS_INCORRECT = "Неправильный логин или пароль"
    EQUAL_VALUES = "Значения равны между собой"
    INCORRECT_FORMAT = "Некорректный формат"
    INCORRECT_STATUS = "Некорректный статус"
    INTEGER_RESTRICTION = "Значение поля должно являться целым числом"
    MISSING_VALUE = "Не передано значение в поле"
    NOT_IN_LIST = "Значение отсутствует в списке допустимых"
    NON_UNIQUE = "Значение не уникально"
    NULL_VALUE_DEFINITION = "Значение не может равняться 0"
    UNAVAILABLE_ATTRIBUTE = "Данный атрибут не поддерживается"
    UPDATE_NOT_ALLOWED = "Изменение поля запрещено"
    VALUES_DO_NOT_MATCH = "Значения полей не совпадают"
    VALUE_MUST_BE_NONE = "Переданное значение должно быть пустым"
    VALUE_OUT_OF_RANGE = "Значение не попадает в диапазон"
    ACCESS_UNAVAILABLE = "Отсутствует доступ к ресурсу"

    # Файлы
    FILE_IS_EMPTY = "Файл пуст"
    FILE_NOT_FOUND = "Файл не найден"
    WRONG_FILE_FORMAT = "Некорректное расширение загружаемого файла"
    FILE_NOT_TRANSFERRED = "Файл не передан"


class TextErrorType(BaseEnum):
    IP_TEMPORARILY_BLOCKED = (
        "Ваш IP адрес заблокирован на {time} из-за подозрительной активности"
    )
