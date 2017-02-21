-export([start/0,
        stop/0,
        start_link/0]).
-export([sctpSendReq/3,
         sctpEndReq/4]).


-export([handle_call/3,
        init/1,
        handle_cast/2,
        handle_info/2,
        terminate/2,
        code_change/3]).

-behaviour(gen_server).
-record(state, {
         socket,
         peerAddress,
         peerPort,
         linkStatus
         }).

start() ->
    ok.

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

stop() ->
    gen_server:cast(?MODULE, stop).

init([]) ->
    {ok, Socket} = gen_udp:open(0,
                               [binary,
                                    {sndbuf, 65000},
                                    {recbuf, 65000}]).
    Port = 2400,
    ok = send(Socket, "127.0.0.1", Port, <<123:8>>);
    {ok, #state{socket = Socket,
               peerAddress = Address,
               peerPort = Port,
               linkStatus = 234}}.
