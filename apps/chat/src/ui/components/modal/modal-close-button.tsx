import { XIcon } from 'lucide-react';

type Props = {
  onClick: VoidFunction;
};

export function ModalCloseButton({ onClick }: Props) {
  return (
    <button
      className="uk-close uk-icon uk-modal-close-default"
      type="button"
      aria-label="Close"
      onClick={onClick}
    >
      <XIcon size={16} />
    </button>
  );
}
