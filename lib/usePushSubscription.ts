import { useCallback, useEffect, useState } from "react";
import {
  ApolloClient,
  NormalizedCacheObject,
  useMutation,
} from "@apollo/client";
import {
  UpdatePushSubscription,
  UpdatePushSubscriptionVariables,
} from "apis/types";
import { UPDATE_PUSH_SUBSCRIPTION } from "apis/user";
import { getPushPermission, getPushSubscription } from "./push";
import useUserId from "./useUserId";

const usePushSubscription = (
  apolloClient?: ApolloClient<NormalizedCacheObject>
) => {
  const [pushEnabled, setPushEnabled] = useState(false);

  const [updatePushSubscription] = useMutation<
    UpdatePushSubscription,
    UpdatePushSubscriptionVariables
  >(UPDATE_PUSH_SUBSCRIPTION, {
    client: apolloClient,
  });

  const userId = useUserId();

  const subscribe = useCallback(
    async (enabled: boolean) => {
      if (userId) {
        if (!enabled) {
          await updatePushSubscription({
            variables: {
              user_id: userId!,
              web_push_subscription: null,
            },
          });
          return setPushEnabled(false);
        }

        const granted = await getPushPermission();
        if (!granted) {
          throw new Error("Notification permission not granted");
        }

        const sub = await getPushSubscription();
        if (!sub) {
          await updatePushSubscription({
            variables: {
              user_id: userId!,
              web_push_subscription: null,
            },
          });
          return setPushEnabled(false);
        }

        await updatePushSubscription({
          variables: {
            user_id: userId!,
            web_push_subscription: JSON.stringify(sub),
          },
        });
        return setPushEnabled(true);
      }
    },
    [updatePushSubscription, userId]
  );

  useEffect(() => {
    subscribe(true)
      .then()
      .catch(() => {});
  }, [subscribe, userId]);

  return [pushEnabled, subscribe] as [
    boolean,
    (enabled: boolean) => Promise<void>
  ];
};

export default usePushSubscription;
