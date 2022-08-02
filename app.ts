import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';

import * as kubernetes from '@cdktf/provider-kubernetes'
import * as helm from '@cdktf/provider-helm'

export class AppStack extends TerraformStack {

  constructor(scope: Construct, name: string) {
	super(scope, name);

	new kubernetes.KubernetesProvider(this, 'k8s', {
	})
	new helm.HelmProvider(this, 'helm', {
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
		replicas: '2',
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

	new helm.Release(this, 'nginx_ingress', {
		name: "nginx-ingress-controller",
		namespace: "dev",
		repository: "https://charts.bitnami.com/bitnami",
		chart: "nginx-ingress-controller",
		set: [
			{
				name: "service.type",
				value: "ClusterIP",
			}
		],
	})

  }
}
