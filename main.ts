import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';

import * as kubernetes from '@cdktf/provider-kubernetes'


class MyStack extends TerraformStack {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    
    new kubernetes.KubernetesProvider(this, 'k8s', {
    })

    new kubernetes.Manifest(this, 'cdktf_app',{ manifest: {
      apiVersion: 'source.toolkit.fluxcd.io/v1beta2',
      kind: 'GitRepository',
      metadata: {
        name: 'cdktf-app',
        namespace: 'dev',
      },
      spec: {
        interval: '30s',
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
        namespace: 'dev',
      },
      spec: {
        path: './cdktf.out/stacks/app/',
        approvePlan: 'auto',
        interval: '1m',
        sourceRef: {
          kind: 'GitRepository',
          name: 'cdktf-app',
          namespace: 'dev',
        },
      },
    }})

    new kubernetes.Deployment(this, 'deployment_myapp', {
      metadata: {
        labels: {
          app: 'myapp',
          component: 'frontend',
          environment: 'dev',
        },
        name: 'myapp',
        namespace: 'dev',
      },
      spec: {
        replicas: '1',
        selector: {
          matchLabels: {
            app: 'myapp',
            component: 'frontend',
            environment: 'dev',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'myapp',
              component: 'frontend',
              environment: 'dev',
            },
          },
          spec: {
            container: [
              {
                image: 'nginx:latest',
                name: 'frontend',
              },
            ],
          },
        },
      },
    })

  }
}

const app = new App();
new MyStack(app, 'app');
app.synth();
