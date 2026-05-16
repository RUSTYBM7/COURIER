import * as React from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, children, className }: EmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-6" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {(actionLabel && onAction) || children ? (
        <EmptyContent>
          {actionLabel && onAction ? (
            <Button onClick={onAction}>{actionLabel}</Button>
          ) : null}
          {children}
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export default EmptyState;
