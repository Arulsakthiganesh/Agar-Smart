from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime

class BaseDataProvider(ABC):
    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        """Returns connection status, latency, and data freshness metadata."""
        pass

    @abstractmethod
    def fetch_latest(self) -> List[Dict[str, Any]]:
        """Fetches the latest atmospheric or sensor observations."""
        pass

    @abstractmethod
    def fetch_historical(self, start_time: datetime, end_time: datetime) -> List[Dict[str, Any]]:
        """Fetches historical observation datasets within specified time bounds."""
        pass
