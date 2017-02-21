-module(sec_crypto_drv)

-include("esec_crypto.hrl")

start() ->
    Path = "/tmp/Linux_gpb_64",
    erl_ddll:load_driver(Path, libesec_crypto_drv),
    open_ports(size(port_names())).

stop() ->
    erl_ddll:unload_driver(libesec_crypto_drv).

open_ports(0) ->
    ok;
open_ports(N) ->
    Port = open_port({spawn, "libesec_crypto_drv"}, []),
    register(element(N, port_names()), Port),
    open_ports(N-1).

port_names() ->
    {esec_crypto_drv01, esec_crypto_drv02, esec_crypto_drv03,   esec_crypto_drv04, esec_crypto_drv05, esec_crypto_drv07}.
