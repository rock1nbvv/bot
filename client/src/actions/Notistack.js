import * as NOTISTACK from '../config/Notistack';

export const enqueueSnackbar = notification => {
  const key = notification.options && notification.options.key;

  return {
    type: NOTISTACK.ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random()
    }
  };
};

export const closeSnackbar = key => ({
  type: NOTISTACK.CLOSE_SNACKBAR,
  dismissAll: !key,
  key
});

export const removeSnackbar = key => ({
  type: NOTISTACK.REMOVE_SNACKBAR,
  key
});
