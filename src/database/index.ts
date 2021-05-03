import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';


export interface RdsPostgresInstanceProps {
  readonly vpc: ec2.IVpc;
}

export class RdsPostgresInstance extends cdk.Construct {

  public rdsPostgresInstance: rds.IDatabaseInstance;
  public rdsSecurityGroup: ec2.ISecurityGroup;
  // public databaseUsername: 

  constructor(scope: cdk.Construct, id: string, props: RdsPostgresInstanceProps) {
    super(scope, id);

    const rdsSecurityGroup = new ec2.SecurityGroup(scope, 'RdsSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'RdsSecurityGroup',
    });
    this.rdsSecurityGroup = rdsSecurityGroup;

    rdsSecurityGroup.addIngressRule(
      ec2.Peer.ipv4('10.0.0.0/16'),
      ec2.Port.tcp(5432),
    );

    const rdsPostgresInstance = new rds.DatabaseInstance(scope, 'RdsDatabaseInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13_1 }),
      vpc: props.vpc,
      vpcPlacement: { subnetType: ec2.SubnetType.ISOLATED },
      port: 5432,
      securityGroups: [rdsSecurityGroup],
    });
    this.rdsPostgresInstance = rdsPostgresInstance;
  }
}
