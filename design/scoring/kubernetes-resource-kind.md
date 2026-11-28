# Scoring: kubernetes-resource-kind (Name a Kubernetes resource kind)

65 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 5 | 0 |
| npe | 20 (31%) | 18 | 0 |
| leak | 6 (9%) | 14 | 0 |
| race | 1 (2%) | 12 | 0 |
| heisenbug | 36 (55%) | 16 | 0 |

Same tier as today: 33/65 (51%).

## Off-by-one (2)

Pod 4.5 [0c 2q 0f], Deployment 4.5 [0c 28143q 1f]

## Null pointer exception (20)

Service 4.2 [0c 25337q 1f], Ingress 3.5 [0c 95q 0f], ConfigMap 3.4 [0c 530q 0f], Secret 3.3 [0c 3q 2f], Node 3.3 [0c 0q 0f], Namespace 3.2 [0c 12862q 1f], Job 3.0 [0c 2895q 0f], ReplicaSet 3.0 [0c 618q 0f], PersistentVolumeClaim 3.0 [0c 0q 3f], PersistentVolume 2.8 [0c 117q 49f], CronJob 2.7 [0c 21604q 0f], ServiceAccount 2.7 [0c 0q 0f], DaemonSet 2.6 [0c 75q 2f], StatefulSet 2.5 [0c 204q 5f], Role 2.5 [0c 3068q 0f], NetworkPolicy 2.4 [0c 0q 0f], ClusterRole 2.3 [0c 0q 0f], HorizontalPodAutoscaler 2.2 [0c 229q 0f], RoleBinding 2.2 [0c 0q 0f], ResourceQuota 2.1 [0c 0q 24f]

## Memory leak (6)

StorageClass 2.0 [0c 11q 17f], Event 1.9 [0c 38166q 0f], Endpoints 1.7 [0c 2136q 0f], LimitRange 1.5 [0c 4732q 0f], CertificateSigningRequest 1.1 [0c 632q 0f], IPAddress 0.8 [0c 5315q 0f]

## Race condition (1)

Workload 0.6 [0c 71q 0f]

## Heisenbug (36)

CustomResourceDefinition 2.0 [0c 0q 0f], ClusterRoleBinding 1.8 [0c 0q 0f], IngressClass 1.8 [0c 0q 0f], ReplicationController 1.8 [0c 0q 0f], PriorityClass 1.2 [0c 0q 0f], EndpointSlice 1.1 [0c 0q 0f], ValidatingWebhookConfiguration 1.0 [0c 0q 0f], PodTemplate 1.0 [0c 0q 0f], CSIDriver 0.9 [0c 27q 0f], ValidatingAdmissionPolicy 0.9 [0c 0q 0f], MutatingWebhookConfiguration 0.8 [0c 0q 0f], APIService 0.8 [0c 0q 0f], VolumeAttachment 0.8 [0c 0q 0f], Lease 0.7 [0c 0q 1f], RuntimeClass 0.7 [0c 0q 0f], CSINode 0.6 [0c 0q 0f], ControllerRevision 0.6 [0c 0q 0f], MutatingAdmissionPolicy 0.6 [0c 0q 0f], PriorityLevelConfiguration 0.5 [0c 0q 0f], ValidatingAdmissionPolicyBinding 0.5 [0c 0q 0f], ResourceClaim 0.4 [0c 0q 0f], MutatingAdmissionPolicyBinding 0.4 [0c 0q 0f], VolumeAttributesClass 0.4 [0c 0q 0f], ServiceCIDR 0.3 [0c 0q 0f], CSIStorageCapacity 0.3 [0c 0q 0f], PodGroup 0.3 [0c 0q 0f], ClusterTrustBundle 0.3 [0c 0q 0f], DeviceClass 0.3 [0c 0q 0f], PodCertificateRequest 0.3 [0c 0q 0f], ComponentStatus 0.2 [0c 0q 0f], ResourceSlice 0.2 [0c 0q 0f], ResourceClaimTemplate 0.2 [0c 0q 0f], LeaseCandidate 0.2 [0c 0q 0f], DeviceTaintRule 0.1 [0c 0q 0f], CompositePodGroup 0.1 [0c 0q 0f], ResourcePoolStatusRequest 0.1 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
