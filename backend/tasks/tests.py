from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker

from .models import Task


class TaskAPITestCase(APITestCase):
    def setUp(self):
        self.list_create_url = reverse("task-list")
        self.first_task = baker.make(Task, title="First Task")
        self.second_task = baker.make(Task, title="Second Task")
        self.detail_url = reverse("task-detail", kwargs={"pk": self.first_task.pk})

    def test_list_tasks_returns_correct_count_and_data_in_descending_created_at_order(self):
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "Second Task")
        self.assertEqual(response.data[1]["title"], "First Task")

    def test_create_task_with_valid_data_returns_201_and_defaults_completed_to_false(self):
        data = {"title": "New Task", "description": "New Description"}
        response = self.client.post(self.list_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 3)
        self.assertEqual(response.data["completed"], False)

    def test_create_task_without_title_returns_400_bad_request(self):
        data = {"description": "Missing title"}
        response = self.client.post(self.list_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_task_with_valid_id_returns_correct_task_data(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "First Task")

    def test_retrieve_task_with_invalid_id_returns_404_not_found(self):
        url = reverse("task-detail", kwargs={"pk": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task_via_put_updates_title_and_description_correctly(self):
        data = {"title": "Updated Title", "description": "Updated Description"}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.first_task.refresh_from_db()
        self.assertEqual(self.first_task.title, "Updated Title")

    def test_update_task_via_put_does_not_allow_changing_completed_status(self):
        data = {
            "title": "Updated Title",
            "description": "Updated Description",
            "completed": True,
        }
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.first_task.refresh_from_db()
        self.assertEqual(self.first_task.completed, False)

    def test_partial_update_via_patch_successfully_toggles_completed_status(self):
        data = {"completed": True}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.first_task.refresh_from_db()
        self.assertEqual(self.first_task.completed, True)

    def test_delete_task_removes_task_from_database_and_returns_204_no_content(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 1)
