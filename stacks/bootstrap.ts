import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';

import * as kubernetes from '@cdktf/provider-kubernetes'

export class BootstrapStack extends TerraformStack {

  constructor(scope: Construct, name: string) {
    super(scope, name);

    new kubernetes.KubernetesProvider(this, 'k8s', {
    })

    const namespace = 'dev'

    new kubernetes.Manifest(this, 'cdktf_app',{ manifest: {
      apiVersion: 'source.toolkit.fluxcd.io/v1beta2',
      kind: 'GitRepository',
      metadata: {
        name: 'cdktf-app',
        namespace: namespace,
      },
      spec: {
        interval: '1m',
        url: 'https://github.com/chanwit/cdktf-app',
        ref: {
          branch: 'main',
        },
      },
    }})

    new kubernetes.Manifest(this, 'app_tf',{ manifest: {
      apiVersion: 'infra.contrib.fluxcd.io/v1alpha1',
      kind: 'Terraform',
      metadata: {
        name: 'app-tf',
        namespace: namespace,
      },
      spec: {
        path: './cdktf.out/stacks/app/',
        approvePlan: 'auto',
        interval: '1m',
        sourceRef: {
          kind: 'GitRepository',
          name: 'cdktf-app',
          namespace: namespace,
        },
      },
    }})

  }
}
