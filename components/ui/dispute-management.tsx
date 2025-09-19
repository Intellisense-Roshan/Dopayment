import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { 
  DisputeRequest, 
  Dispute, 
  DisputeComment,
  DisputeStatus 
} from '../types/refund';
import { DisputeSchema } from '../types/refund';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Card } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Badge } from './badge';
import { Separator } from './separator';

interface DisputeManagementProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  transactionId: string;
  onSubmitDispute: (request: DisputeRequest) => Promise<Dispute>;
  onAddComment: (disputeId: string, comment: string) => Promise<DisputeComment>;
  onUpdateStatus: (disputeId: string, status: DisputeStatus) => Promise<void>;
  existingDispute?: Dispute;
  comments?: DisputeComment[];
}

const statusColors: Record<DisputeStatus, {
  bg: string;
  text: string;
}> = {
  open: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  investigating: { bg: 'bg-blue-100', text: 'text-blue-800' },
  resolved: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  escalated: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

export const DisputeManagement: React.FC<DisputeManagementProps> = ({
  isOpen,
  onClose,
  orderId,
  transactionId,
  onSubmitDispute,
  onAddComment,
  onUpdateStatus,
  existingDispute,
  comments = [],
}) => {
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const form = useForm<DisputeRequest>({
    resolver: zodResolver(DisputeSchema),
    defaultValues: {
      orderId,
      transactionId,
      reason: '',
    },
  });

  const handleSubmit = async (data: DisputeRequest) => {
    try {
      await onSubmitDispute(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dispute');
    }
  };

  const handleAddComment = async () => {
    if (!existingDispute || !newComment.trim()) return;

    try {
      await onAddComment(existingDispute.disputeId, newComment);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const handleStatusUpdate = async (status: DisputeStatus) => {
    if (!existingDispute) return;

    try {
      await onUpdateStatus(existingDispute.disputeId, status);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {existingDispute ? 'Manage Dispute' : 'Create Dispute'}
          </DialogTitle>
        </DialogHeader>

        {!existingDispute ? (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Dispute</Label>
                  <Textarea
                    id="reason"
                    {...form.register('reason')}
                    placeholder="Please provide detailed information about the dispute"
                  />
                </div>
              </div>
            </Card>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit Dispute</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Dispute Status</h3>
                    <Badge
                      className={`mt-1 ${
                        statusColors[existingDispute.status].bg
                      } ${statusColors[existingDispute.status].text}`}
                    >
                      {existingDispute.status}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    {existingDispute.status === 'open' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate('investigating')}
                        >
                          Start Investigation
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate('rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {existingDispute.status === 'investigating' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate('escalated')}
                        >
                          Escalate
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate('resolved')}
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Original Dispute</h4>
                  <p className="text-gray-600">{existingDispute.reason}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Raised on: {new Date(existingDispute.createdAt).toLocaleString()}
                  </p>
                </div>

                {existingDispute.resolution && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Resolution</h4>
                      <Badge className="mb-2">
                        {existingDispute.resolution.outcome}
                      </Badge>
                      <p className="text-gray-600">
                        {existingDispute.resolution.reason}
                      </p>
                      {existingDispute.resolution.amount && (
                        <p className="text-sm font-medium mt-2">
                          Amount: ₹{existingDispute.resolution.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Discussion</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {comment.authorType} ({comment.authorId})
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.message}</p>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="flex gap-2">
                        {comment.attachments.map((attachment, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(attachment)}
                          >
                            View Attachment {index + 1}
                          </Button>
                        ))}
                      </div>
                    )}
                    <Separator />
                  </div>
                ))}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </Card>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};