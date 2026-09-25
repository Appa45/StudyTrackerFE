"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import TopicForm, {
  type TopicFormValues,
} from "./TopicForm";

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: TopicFormValues) => Promise<void> | void;
}

export default function AddTopicModal({
  isOpen,
  onClose,
  onCreate,
}: AddTopicModalProps) {
  const [formKey, setFormKey] = useState(0);

  async function handleCreate(values: TopicFormValues) {
    await onCreate(values);

    // Reset the form next time modal opens
    setFormKey((previous) => previous + 1);

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new topic"
      description="Create a study topic and start tracking your progress."
      size="md"
    >
      <TopicForm
        key={formKey}
        mode="create"
        onSubmit={handleCreate}
        onCancel={onClose}
      />
    </Modal>
  );
}