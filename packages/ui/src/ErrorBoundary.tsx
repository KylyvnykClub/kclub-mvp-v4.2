'use client';

import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

import { DataState } from './index';

type ErrorBoundaryProps = Readonly<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  title?: string;
  message?: string;
}>;

type ErrorBoundaryState = Readonly<{ hasError: boolean; error: Error | null }>;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <DataState
        tone="error"
        title={this.props.title ?? 'Something went wrong'}
        message={this.props.message ?? 'An unexpected error occurred. Please try again.'}
      />
    );
  }
}
