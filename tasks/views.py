from django.shortcuts import render
from rest_framework import mixins, viewsets

from .models import Task
from .serializers import TaskSerializer


def index(request):
    return render(request, "tasks/index.html")


class TaskViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer