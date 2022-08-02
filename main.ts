import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

import * as kubernetes from "@cdktf/provider-kubernetes"


class MyStack extends TerraformStack {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    
    new kubernetes.KubernetesProvider(this, 'k8s', {
    })

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
new MyStack(app, "app");
app.synth();
