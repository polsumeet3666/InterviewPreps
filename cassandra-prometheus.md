# Monitoring Cassandra with Prometheus
Cassandra is one of many Java-based systems that offers metrics via JMX. The JMX Exporter offers way to use these with Prometheus. By following these steps you can be up and running in under a minute!  

We'll start from scratch, first we download and extract the latest Cassandra tarball:
1. wget http://archive.apache.org/dist/cassandra/2.2.4/apache-cassandra-2.2.4-bin.tar.gz  
2. tar -xzf apache-cassandra-bin.tar.gz  
3. cd apache-cassandra-* 


We'll also need the JMX exporter java agent, configuration, and to tell Cassandra to use it:  

	1. wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.3.0/jmx_prometheus_javaagent-0.3.0.jar
	2. wget https://raw.githubusercontent.com/prometheus/jmx_exporter/master/example_configs/cassandra.yml
	3. echo 'JVM_OPTS="$JVM_OPTS -javaagent:'$PWD/jmx_prometheus_javaagent-0.3.0.jar=7070:$PWD/cassandra.yml'"' >> conf/cassandra-env.sh

Now we can run Cassandra:

./bin/cassandra &  

**If you visit http://localhost:7070/metrics you'll see the metrics.**



Metrics alone aren't very useful, let's setup a quick Prometheus server:

	wget https://github.com/prometheus/prometheus/releases/download/v2.0.0/prometheus-2.0.0.linux-amd64.tar.gz
	tar -xzf prometheus-2.0.0.linux-amd64.tar.gz
	cd prometheus-*
	cat <<'EOF' > prometheus.yml
	global:
	scrape_interval: 10s
	evaluation_interval: 10s
	scrape_configs:
	- job_name: 'cassandra'
	static_configs:
	- targets:
	  - localhost:7070
	EOF
	./prometheus


**If you visit http://localhost:9090/metrics you'll see the metrics.**

## Grafana

wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.2.2.linux-amd64.tar.gz
tar -zxvf grafana-5.2.2.linux-amd64.tar.gz

As an example, on Linux, installing Grafana could look like this:

# Download and unpack Grafana from binary tar (adjust version as appropriate).
curl -L -O https://grafanarel.s3.amazonaws.com/builds/grafana-2.5.0.linux-x64.tar.gz
tar zxf grafana-2.5.0.linux-x64.tar.gz

# Start Grafana.
cd grafana-2.5.0/
./bin/grafana-server web

Using

By default, Grafana will be listening on http://localhost:3000. The default login is "admin" / "admin".
Creating a Prometheus data source

To create a Prometheus data source:

    Click on the Grafana logo to open the sidebar menu.
    Click on "Data Sources" in the sidebar.
    Click on "Add New".
    Select "Prometheus" as the type.
    Set the appropriate Prometheus server URL (for example, http://localhost:9090/)
    Adjust other data source settings as desired (for example, turning the proxy access off).
    Click "Add" to save the new data source.

The following shows an example data source configuration:

_ref: 
https://www.robustperception.io/monitoring-cassandra-with-prometheus 
https://cassandra-zone.com/performance-monitoring/
_