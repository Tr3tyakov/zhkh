class PipelineContext:
    def __init__(self):
        object.__setattr__(self, "_data", {})

    def __getattr__(self, item):
        return self._data.get(item)

    def __setattr__(self, key, value):
        self._data[key] = value
