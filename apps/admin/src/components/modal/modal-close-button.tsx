import { UkIcon } from '~/icons';

type Props = {
  onClick: VoidFunction;
};

export function ModalCloseButton({ onClick }: Props) {
  return (
    <button
      className="uk-modal-close-default uk-icon uk-close"
      type="button"
      aria-label="Close"
      onClick={onClick}
    >
      <UkIcon icon="x" />
    </button>
  );
}
