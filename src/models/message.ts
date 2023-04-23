export class Message {
  "@odata.type": string;
  "@odata.etag": string;
  id!: string;
  createdDateTime!: string;
  lastModifiedDateTime!: string;
  changeKey!: string;
  categories!: string[];
  receivedDateTime!: string;
  sentDateTime!: string;
  hasAttachments!: boolean;
  internetMessageId!: string;
  subject!: string;
  bodyPreview!: string;
  importance!: string;
  parentFolderId!: string;
  conversationId!: string;
  conversationIndex!: string;
  isDeliveryReceiptRequested!: boolean;
  isReadReceiptRequested!: boolean;
  isRead!: boolean;
  isDraft!: boolean;
  webLink!: string;
  inferenceClassification!: string;
  body!: MessageBody;
  sender!: MessageSender;
  from!: MessageFrom;
  toRecipients!: MessageToRecipient[];
  ccRecipients!: string[];
  bccRecipients!: string[];
  replyTo!: string[];
  flag!: MessageFlag;
}

export class MessageFlag {
  flagStatus!: string;
}
export class MessageBody {
  contentType!: string;
  content!: string;
}

export class EmailAddress {
  name!: string;
  address!: string;
}

export class MessageSender {
  emailAddress!: EmailAddress;
}

export class MessageFrom {
  emailAddress!: EmailAddress;
}

export class MessageToRecipient {
  emailAddress!: EmailAddress;
}

export class MessagesPage {
  "@odata.context": string;
  value!: Message[];
  "@odata.nextLink": string;
}

export class MessageForSend {
  message!: {
    subject: string;
    body: MessageBody;
    toRecipients: MessageToRecipient[];
  };
}
