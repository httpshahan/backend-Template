#!/bin/bash

# Deployment script for Kubernetes
set -e

NAMESPACE=${NAMESPACE:-default}
IMAGE_TAG=${IMAGE_TAG:-latest}
ENVIRONMENT=${ENVIRONMENT:-staging}

echo "🚀 Deploying Backend API to Kubernetes..."
echo "Environment: $ENVIRONMENT"
echo "Namespace: $NAMESPACE"
echo "Image Tag: $IMAGE_TAG"

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations in order
echo "📝 Applying secrets and configs..."
kubectl apply -f k8s/secrets.yaml -n $NAMESPACE

echo "🗄️ Deploying database services..."
kubectl apply -f k8s/database.yaml -n $NAMESPACE

echo "⏳ Waiting for database to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s

# Update deployment with new image tag
echo "🔄 Updating application deployment..."
sed "s|ghcr.io/your-username/backend-template:latest|ghcr.io/your-username/backend-template:$IMAGE_TAG|g" k8s/deployment.yaml | kubectl apply -f - -n $NAMESPACE

echo "⏳ Waiting for deployment to complete..."
kubectl rollout status deployment/backend-api -n $NAMESPACE --timeout=300s

# Run database migrations
echo "🗄️ Running database migrations..."
kubectl run migration-job --image=ghcr.io/your-username/backend-template:$IMAGE_TAG --rm -i --restart=Never -n $NAMESPACE -- npm run db:migrate

echo "🔍 Verifying deployment..."
kubectl get pods -l app=backend-api -n $NAMESPACE
kubectl get services -n $NAMESPACE

# Health check
echo "🏥 Performing health check..."
SERVICE_IP=$(kubectl get service backend-api-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
if kubectl run health-check --image=curlimages/curl --rm -i --restart=Never -n $NAMESPACE -- curl -f http://$SERVICE_IP/health; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Deployment summary:"
kubectl get all -l app=backend-api -n $NAMESPACE
