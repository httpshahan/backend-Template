#!/bin/bash

# Rollback script for Kubernetes deployment
set -e

NAMESPACE=${NAMESPACE:-default}
REVISION=${REVISION:-}

echo "🔄 Rolling back Backend API deployment..."
echo "Namespace: $NAMESPACE"

if [ -n "$REVISION" ]; then
    echo "Rolling back to revision: $REVISION"
    kubectl rollout undo deployment/backend-api --to-revision=$REVISION -n $NAMESPACE
else
    echo "Rolling back to previous revision"
    kubectl rollout undo deployment/backend-api -n $NAMESPACE
fi

echo "⏳ Waiting for rollback to complete..."
kubectl rollout status deployment/backend-api -n $NAMESPACE --timeout=300s

echo "🔍 Verifying rollback..."
kubectl get pods -l app=backend-api -n $NAMESPACE

# Health check
echo "🏥 Performing health check..."
SERVICE_IP=$(kubectl get service backend-api-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
if kubectl run health-check --image=curlimages/curl --rm -i --restart=Never -n $NAMESPACE -- curl -f http://$SERVICE_IP/health; then
    echo "✅ Health check passed after rollback!"
else
    echo "❌ Health check failed after rollback!"
    exit 1
fi

echo "✅ Rollback completed successfully!"

# Show rollback history
echo "📊 Rollout history:"
kubectl rollout history deployment/backend-api -n $NAMESPACE
