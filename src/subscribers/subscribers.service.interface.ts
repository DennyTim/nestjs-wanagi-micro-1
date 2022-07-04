import { CreateSubscriberDto } from "./create-subscriber.dto";
import { Subscriber } from "./subscriber.service";

export interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAllSubscribers(params: {}): Promise<Subscriber>
}
