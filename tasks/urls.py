from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TaskViewSet, index


router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")


urlpatterns = [
    path("", index, name="index"),
    path("api/", include(router.urls)),
]