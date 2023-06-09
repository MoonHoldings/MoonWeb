export const displayNotifModal = (type, message, notification) => {
  notification.open({
    closeIcon: (
      <svg
        className="ml-2"
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="close"
        width="0.9em"
        height="0.9em"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
      </svg>
    ),
    type: type.toLowerCase(),
    className: 'bg-[#191C20] text-white',
    description: message,
    duration: 5,
    placement: 'top',
    message: <p className="text-capitalize text-white">{type}</p>,
  })
}
