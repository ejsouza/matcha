export interface CreateChatDto {
  id?: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  sent_at: Date;
}
