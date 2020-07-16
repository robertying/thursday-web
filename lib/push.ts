export const isPushCompatible = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getPushPermission = () => {
  return new Promise<boolean>((resolve) => {
    if (Notification.permission === "granted") {
      return resolve(true);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    } else {
      return resolve(false);
    }
  });
};

function urlBase64ToUint8Array(base64String: string) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const getPushSubscription = () => {
  return new Promise<PushSubscription | null>((resolve) => {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then(async function (subscription) {
          if (subscription) {
            return resolve(subscription);
          } else {
            const sub = await serviceWorkerRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
              ),
            });
            return resolve(sub);
          }
        })
        .catch(function (err) {
          console.error(err);
          return resolve(null);
        });
    });
  });
};
