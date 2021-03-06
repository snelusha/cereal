const SUBSCRIPTION_STATES = {
  VIRGIN: Symbol("SUBSCRIPTION_STATES.VIRGIN"),
  CALLED: Symbol("SUBSCRIPTION_STATES.CALLED"),
};

const subscriptions = new Map();

function getOrCreateSubscription(topic) {
  if (!subscriptions.has(topic)) {
    const subscriptionTemplate = {
      state: SUBSCRIPTION_STATES.VIRGIN,
      lastPayload: null,
      observers: [],
    };
    subscriptions.set(topic, subscriptionTemplate);
  }
  return subscriptions.get(topic);
}

export function subscribe(topic, observer, runIfPublished = false) {
  const subscription = getOrCreateSubscription(topic);
  subscription.observers.push(observer);
  if (runIfPublished && subscription.state === SUBSCRIPTION_STATES.CALLED) {
    observer(subscription.lastPayload);
  }
  const unsubscribe = () =>
    subscription.observers.splice(subscription.observers.indexOf(observer), 1);
  return unsubscribe;
}

export function publish(topic, payload) {
  const subscription = getOrCreateSubscription(topic);
  subscription.lastPayload = payload;
  subscription.state = SUBSCRIPTION_STATES.CALLED;
  subscription.observers.forEach((observer) => observer(payload));
}

export function clear() {
  subscriptions.clear();
}
