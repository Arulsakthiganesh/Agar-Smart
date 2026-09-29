from abc import ABC, abstractmethod
from typing import Dict, Any, List
import numpy as np

class BaseNowcastingModel(ABC):
    def __init__(self, model_name: str, version: str = "1.0.0"):
        self.model_name = model_name
        self.version = version
        self.is_trained = True

    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Runs model inference on input features and returns predictions."""
        pass

    @abstractmethod
    def get_metrics(self) -> Dict[str, Any]:
        """Returns validation performance metrics (Accuracy, Precision, Recall, F1)."""
        pass
