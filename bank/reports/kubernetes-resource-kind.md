# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: kubernetes.

## kubernetes-resource-kind

67 candidates; 50 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Deployment | 0 | 58 | 245 | 0.80 | npe | counts | off-by-one | — |
| Service | 0 | 55 | 256 | 0.80 | npe | counts | off-by-one | — |
| Workload ⚠ counts said npe | 0 | 34 | 193 | 0.78 | race | judge (override) | race | — |
| Pod | 0 | 42 | 84 | 0.74 | npe | counts | off-by-one | — |
| Node | 0 | 14 | 137 | 0.66 | npe | counts | off-by-one | — |
| Job ⚠ counts said leak | 1 | 9 | 42 | 0.53 | off-by-one | judge (override) | off-by-one | — |
| Event | 0 | 4 | 42 | 0.46 | leak | counts | npe | — |
| Role | 0 | 1 | 31 | 0.34 | leak | counts | npe | — |
| Namespace | 0 | 2 | 8 | 0.28 | off-by-one | judge | off-by-one | — |
| Secret | 0 | 2 | 7 | 0.27 | off-by-one | judge | off-by-one | — |
| Endpoints ⚠ counts said heisenbug | 0 | 0 | 10 | 0.18 | leak | judge (override) | leak | — |
| StatefulSet | 0 | 0 | 3 | 0.11 | npe | judge | npe | — |
| DaemonSet | 0 | 0 | 2 | 0.08 | npe | judge | npe | — |
| ConfigMap | 0 | 0 | 2 | 0.08 | off-by-one | judge | off-by-one | — |
| NetworkPolicy | 0 | 0 | 2 | 0.08 | npe | judge | npe | — |
| ValidatingAdmissionPolicy | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| Lease | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| Ingress | 0 | 0 | 1 | 0.05 | off-by-one | judge | off-by-one | — |
| MutatingAdmissionPolicyBinding ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MutatingAdmissionPolicy ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MutatingWebhookConfiguration ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ValidatingAdmissionPolicyBinding ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ValidatingWebhookConfiguration ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CustomResourceDefinition ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| APIService ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ControllerRevision ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ReplicaSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| HorizontalPodAutoscaler ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| CronJob ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| CertificateSigningRequest ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ClusterTrustBundle ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PodCertificateRequest ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LeaseCandidate ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ComponentStatus ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LimitRange ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PersistentVolumeClaim ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PersistentVolume ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PodTemplate ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ReplicationController ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ResourceQuota ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ServiceAccount ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| EndpointSlice ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| FlowSchema | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| PriorityLevelConfiguration ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IngressClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| IPAddress ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ServiceCIDR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RuntimeClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PodDisruptionBudget | 0 | 0 | 0 | 0.00 | womm | pin | — | — |
| ClusterRoleBinding ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ClusterRole ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| RoleBinding ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| DeviceClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DeviceTaintRule ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ResourceClaimTemplate ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ResourceClaim ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ResourcePoolStatusRequest ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ResourceSlice ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CompositePodGroup ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PodGroup ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PriorityClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CSIDriver ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CSINode ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CSIStorageCapacity ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| StorageClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| VolumeAttachment ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VolumeAttributesClass ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Job (counts said leak, now off-by-one), Endpoints (counts said heisenbug, now leak), Workload (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

