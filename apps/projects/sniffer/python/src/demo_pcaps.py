"""PCAPs sintéticos para demos e testes (Scapy). Nunca tráfego real."""

from __future__ import annotations

from pathlib import Path

from scapy.all import ARP, DNS, DNSQR, Ether, IP, TCP, UDP, wrpcap


def write_port_scan_demo(path: Path) -> None:
    packets = [
        Ether() / IP(src="10.0.0.5", dst="10.0.0.10") / TCP(dport=port, flags="S")
        for port in range(1, 201)
    ]
    wrpcap(str(path), packets)


def write_arp_spoof_demo(path: Path) -> None:
    packets = [
        Ether(src="aa:aa:aa:aa:aa:aa", dst="ff:ff:ff:ff:ff:ff")
        / ARP(op=2, psrc="10.0.0.1", hwsrc="aa:aa:aa:aa:aa:aa", pdst="10.0.0.2"),
        Ether(src="bb:bb:bb:bb:bb:bb", dst="ff:ff:ff:ff:ff:ff")
        / ARP(op=2, psrc="10.0.0.1", hwsrc="bb:bb:bb:bb:bb:bb", pdst="10.0.0.2"),
    ]
    wrpcap(str(path), packets)


def write_dns_tunnel_demo(path: Path) -> None:
    normal = [
        Ether()
        / IP(src="10.0.0.5", dst="10.0.0.53")
        / UDP(sport=53000, dport=53)
        / DNS(rd=1, qd=DNSQR(qname="www.example.com")),
        Ether()
        / IP(src="10.0.0.5", dst="10.0.0.53")
        / UDP(sport=53001, dport=53)
        / DNS(rd=1, qd=DNSQR(qname="api.github.com")),
    ]
    high_entropy_label = (
        "abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrstuvwxyz234567"
    )
    tunneled = (
        Ether()
        / IP(src="10.0.0.9", dst="10.0.0.53")
        / UDP(sport=54000, dport=53)
        / DNS(rd=1, qd=DNSQR(qname=f"{high_entropy_label}.exfil.attacker.test"))
    )
    wrpcap(str(path), [*normal, tunneled])


def _beacon_packet(time_s: float, *, src: str, dst: str, dport: int) -> object:
    packet = (
        Ether()
        / IP(src=src, dst=dst)
        / UDP(sport=50000, dport=dport)
        / DNS(rd=1, qd=DNSQR(qname="ping.example.com"))
    )
    packet.time = time_s
    return packet


def write_beaconing_demo(path: Path) -> None:
    src = "10.0.0.5"
    dst = "10.0.0.53"
    dport = 53
    periodic = [_beacon_packet(i * 5.0, src=src, dst=dst, dport=dport) for i in range(25)]
    noisy = [
        _beacon_packet(2.0, src="10.0.0.6", dst=dst, dport=dport),
        _beacon_packet(9.0, src="10.0.0.6", dst=dst, dport=dport),
        _beacon_packet(30.0, src="10.0.0.6", dst=dst, dport=dport),
        _beacon_packet(31.1, src="10.0.0.6", dst=dst, dport=dport),
    ]
    wrpcap(str(path), [*periodic, *noisy])


DEMO_PCAP_WRITERS: dict[str, tuple[str, object]] = {
    "port-scan-demo.pcap": ("Port scan (SYN)", write_port_scan_demo),
    "arp-spoof-demo.pcap": ("ARP spoofing", write_arp_spoof_demo),
    "dns-tunnel-demo.pcap": ("DNS tunneling", write_dns_tunnel_demo),
    "beaconing-demo.pcap": ("Beaconing", write_beaconing_demo),
}
