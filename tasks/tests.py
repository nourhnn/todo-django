from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskAPITests(APITestCase):

    

    def test_list_tasks(self):
        Task.objects.create(title="Première tâche")

        response = self.client.get(reverse("task-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_task(self):
        response = self.client.post(
            reverse("task-list"),
            {"title": "Nouvelle tâche"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().title, "Nouvelle tâche")

    def test_delete_task(self):
        task = Task.objects.create(title="Tâche à supprimer")

        response = self.client.delete(
            reverse("task-detail", args=[task.id])
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertEqual(Task.objects.count(), 0),

    def test_update_task(self):
        task = Task.objects.create(title="Ancien titre")

        response = self.client.patch(
            reverse("task-detail", args=[task.id]),
            {"title": "Nouveau titre"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        task.refresh_from_db()

        self.assertEqual(task.title, "Nouveau titre")


    def test_complete_task(self):
        task = Task.objects.create(title="Ma tâche")

        response = self.client.patch(
            reverse("task-detail", args=[task.id]),
            {"completed": True},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        task.refresh_from_db()

        self.assertTrue(task.completed)
        

        