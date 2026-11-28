# Scoring: kubernetes-resource-kind (Name a Kubernetes resource kind)

65 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 20 (31%) | 20 | 0 |
| leak | 3 (5%) | 3 | 0 |
| race | 2 (3%) | 2 | 0 |
| heisenbug | 38 (58%) | 38 | 0 |

Same tier as today: 65/65 (100%).

## Off-by-one (2)

Pod 4.5 [0c 0q 0f 0s], Deployment 4.5 [0c 0q 1f 0s]

## Null pointer exception (20)

Service 4.2 [0c 0q 1f 0s], Ingress 3.5 [0c 0q 0f 0s], ConfigMap 3.4 [0c 530q 0f 0s], Secret 3.3 [0c 0q 2f 0s], Node 3.3 [0c 0q 0f 0s], Namespace 3.2 [0c 12745q 0f 0s], Job 3.0 [0c 0q 0f 0s], ReplicaSet 3.0 [0c 617q 0f 0s], PersistentVolumeClaim 3.0 [0c 0q 0f 0s], PersistentVolume 2.8 [0c 0q 0f 0s], CronJob 2.7 [0c 21604q 0f 0s], ServiceAccount 2.7 [0c 0q 0f 0s], DaemonSet 2.6 [0c 75q 0f 0s], StatefulSet 2.5 [0c 99q 0f 0s], Role 2.5 [0c 0q 0f 0s], NetworkPolicy 2.4 [0c 0q 0f 0s], ClusterRole 2.3 [0c 0q 0f 0s], HorizontalPodAutoscaler 2.2 [0c 34q 0f 0s], RoleBinding 2.2 [0c 0q 0f 0s], ResourceQuota 2.1 [0c 0q 24f 0s]

## Memory leak (3)

Endpoints 1.7 [0c 2136q 0f 0s], LimitRange 1.5 [0c 4732q 0f 0s], IPAddress 0.8 [0c 5315q 0f 0s]

## Race condition (2)

CertificateSigningRequest 1.1 [0c 24q 0f 0s], CSIDriver 0.9 [0c 27q 0f 0s]

## Heisenbug (38)

CustomResourceDefinition 2.0 [0c 0q 0f 0s], StorageClass 2.0 [0c 5q 0f 0s], Event 1.9 [0c 0q 0f 0s], ClusterRoleBinding 1.8 [0c 0q 0f 0s], IngressClass 1.8 [0c 0q 0f 0s], ReplicationController 1.8 [0c 0q 0f 0s], PriorityClass 1.2 [0c 0q 0f 0s], EndpointSlice 1.1 [0c 0q 0f 0s], ValidatingWebhookConfiguration 1.0 [0c 0q 0f 0s], PodTemplate 1.0 [0c 0q 0f 0s], ValidatingAdmissionPolicy 0.9 [0c 0q 0f 0s], MutatingWebhookConfiguration 0.8 [0c 0q 0f 0s], APIService 0.8 [0c 0q 0f 0s], VolumeAttachment 0.8 [0c 0q 0f 0s], Lease 0.7 [0c 0q 1f 1s], RuntimeClass 0.7 [0c 0q 0f 0s], CSINode 0.6 [0c 0q 0f 0s], ControllerRevision 0.6 [0c 0q 0f 0s], MutatingAdmissionPolicy 0.6 [0c 0q 0f 0s], Workload 0.6 [0c 0q 0f 0s], PriorityLevelConfiguration 0.5 [0c 0q 0f 0s], ValidatingAdmissionPolicyBinding 0.5 [0c 0q 0f 0s], ResourceClaim 0.4 [0c 0q 0f 0s], MutatingAdmissionPolicyBinding 0.4 [0c 0q 0f 0s], VolumeAttributesClass 0.4 [0c 0q 0f 0s], ServiceCIDR 0.3 [0c 0q 0f 0s], CSIStorageCapacity 0.3 [0c 0q 0f 0s], ClusterTrustBundle 0.3 [0c 0q 0f 0s], PodGroup 0.3 [0c 0q 0f 0s], DeviceClass 0.3 [0c 0q 0f 0s], PodCertificateRequest 0.3 [0c 0q 0f 0s], ComponentStatus 0.2 [0c 0q 0f 0s], ResourceSlice 0.2 [0c 0q 0f 0s], ResourceClaimTemplate 0.2 [0c 0q 0f 0s], LeaseCandidate 0.2 [0c 0q 0f 0s], DeviceTaintRule 0.1 [0c 0q 0f 0s], CompositePodGroup 0.1 [0c 0q 0f 0s], ResourcePoolStatusRequest 0.1 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
