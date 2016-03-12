import {
  createMessage,
} from '../api/messaging';

// Usage, assuming using Fluorine
// dispatch(executeCell(id,source)(channels))

export default function kernelInfo(channels) {
  if (!channels || !channels.shell) {
    throw new Error('shell channel not available for sending kernel info request');
  }
  const { shell } = channels;

  const message = createMessage('kernel_info_request');
  return shell
    .childOf(message)
    .map(msg => msg.content)
    .first()
    .toPromse();
}
