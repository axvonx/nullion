# Name a Kubernetes resource kind
id: kubernetes-resource-kind · domain: os-systems · status: approved
> Any kind name served by the Kubernetes API, built-in or from a standard API group, as listed by kubectl api-resources.

## Off-by-one
- Deployment | deployment-v1 | deploy (auto)
- Pod | pod-v1 | po (auto)

## Works on my machine
- PodDisruptionBudget | PDB | pod-disruption-budget-v1
  note: The availability guardrail everyone names to show they've run production clusters.

## Null pointer exception
- DaemonSet | daemon-set-v1 | ds (auto)
- ReplicaSet | replica-set-v1 | rs (auto)
- StatefulSet | stateful-set-v1 | sts (auto)
- HorizontalPodAutoscaler | HPA | horizontal-pod-autoscaler-v2 (auto)
- CronJob | cron-job-v1 | cj (auto)
- Node | node-v1 | no (auto)
- PersistentVolumeClaim | PVC | persistent-volume-claim-v1 (auto)
- PersistentVolume | persistent-volume-v1 | pv (auto)
- ServiceAccount | service-account-v1 | sa (auto)
- Service | service-v1 | svc (auto)
- NetworkPolicy | network-policy-v1 | netpol (auto)
- ClusterRole | cluster-role-v1 (auto)
- RoleBinding | role-binding-v1 (auto)
- Job | job-v1 (auto)
- ConfigMap | config-map-v1 | cm (auto)
- Namespace | namespace-v1 | ns (auto)
- Secret | secret-v1 (auto)
- Ingress | ingress-v1 | ing (auto)
- ResourceQuota | resource-quota-v1 | quota (auto)
- Role | role-v1 (auto)

## Memory leak
- CertificateSigningRequest | CSR | certificate-signing-request-v1 (auto)
- Endpoints | endpoints-v1 | ep (auto)
- Event | event-v1 | ev (auto)
- LimitRange | limit-range-v1 | limits (auto)
- IPAddress | ip-address-v1 (auto)
- Workload | workload-v1beta1 (auto)

## Race condition
- CSIDriver | csi-driver-v1 (auto)

## Heisenbug
- MutatingAdmissionPolicyBinding | mutating-admission-policy-binding-v1 (auto)
- MutatingAdmissionPolicy | mutating-admission-policy-v1 (auto)
- ClusterTrustBundle | cluster-trust-bundle-v1 (auto)
- PodCertificateRequest | pod-certificate-request-v1 (auto)
- LeaseCandidate | lease-candidate-v1beta1 (auto)
- PriorityLevelConfiguration | priority-level-configuration-v1 (auto)
- ServiceCIDR | service-cidr-v1 (auto)
- DeviceClass | device-class-v1 (auto)
- DeviceTaintRule | device-taint-rule-v1 (auto)
- ResourceClaimTemplate | resource-claim-template-v1 (auto)
- ResourcePoolStatusRequest | resource-pool-status-request-v1alpha3 (auto)
- ResourceSlice | resource-slice-v1 (auto)
- CompositePodGroup | composite-pod-group-v1alpha3 (auto)
- CSIStorageCapacity | csi-storage-capacity-v1 (auto)
- VolumeAttributesClass | volume-attributes-class-v1 (auto)
- CustomResourceDefinition | CRD | custom-resource-definition-v1 (auto)
- ClusterRoleBinding | cluster-role-binding-v1 (auto)
- MutatingWebhookConfiguration | mutating-webhook-configuration-v1 (auto)
- ValidatingWebhookConfiguration | validating-webhook-configuration-v1 (auto)
- Lease | lease-v1 (auto)
- ReplicationController | replication-controller-v1 (auto)
- EndpointSlice | endpoint-slice-v1 (auto)
- IngressClass | ingress-class-v1 (auto)
- RuntimeClass | runtime-class-v1 (auto)
- PriorityClass | priority-class-v1 (auto)
- ValidatingAdmissionPolicyBinding | validating-admission-policy-binding-v1 (auto)
- ValidatingAdmissionPolicy | validating-admission-policy-v1 (auto)
- APIService | api-service-v1 (auto)
- ControllerRevision | controller-revision-v1 (auto)
- ComponentStatus | component-status-v1 (auto)
- PodTemplate | pod-template-v1 (auto)
- ResourceClaim | resource-claim-v1 (auto)
- PodGroup | pod-group-v1beta1 (auto)
- CSINode | csi-node-v1 (auto)
- VolumeAttachment | volume-attachment-v1 (auto)
- StorageClass | storage-class-v1 | sc (auto)

## Bit Flip
- FlowSchema | flow-schema-v1
  note: Part of API Priority and Fairness — classifies incoming API requests into priority queues.
