%% Team Nebula Coding Dojo: Exercise 2 tmall server gen_server version
%% tmall_gen_server:start_link().
%% tmall_gen_server:order("IPhone 7 plus", 6088, "Apple IPhone.")

-module(tmall_gen_server).
-behaviour(gen_server).

-export([start_link/0, order/3, remove_order/1, cart/0, empty_cart/0, close/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
         terminate/2, code_change/3]).

-record(order, {name, price, description}).

%%% Client API
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

%% Synchronous call
order(Name, Price, Description) ->
    gen_server:call(?MODULE, {order, Name, Price, Description}).

empty_cart() ->
    gen_server:call(?MODULE, empty).

remove_order(Order = #order{}) ->
    gen_server:call(?MODULE, {remove, Order}).

cart() ->
    Cart = gen_server:call(?MODULE, list),
    list_order(Cart). 

%% Asynchronous call
close() ->
    gen_server:cast(?MODULE, terminate).

%%% Server functions
init([]) -> {ok, []}. %% no treatment of info here!

handle_call({order, Name, Price, Description}, _From, Cart) ->
    Order = make_order(Name, Price, Description),
    if Cart =:= [] ->
        {reply, Order, [Order]};
       Cart =/= [] ->
        {reply, Order, [Order|Cart]}
    end;

handle_call(list, _From, Cart) ->
    {reply, Cart, Cart};

handle_call(empty, _From, _Cart) ->
    {reply, ok, []};

handle_call({remove, Order = #order{}}, _From, Cart) ->
    NewCart = lists:delete(Order, Cart),
    {reply, NewCart, NewCart}.

handle_cast(terminate, Cart) ->
    {stop, normal, Cart}.

handle_info(Msg, Cart) ->
    io:format("Unexpected message: ~p~n",[Msg]),
    {noreply, Cart}.

terminate(normal, _Cart) ->
    io:format("Tmall Server is going down. ~n"),
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}. 

%%% Private functions
make_order(Name, Price, Desc) ->
    #order{name=Name, price=Price, description=Desc}.

list_order(Cart) ->
    [io:format("Name:~p  Price:~p Description:~p ~n",[C#order.name, C#order.price, C#order.description]) || C <- Cart],
    ok.
